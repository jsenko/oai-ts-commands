/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Oas20PropertySchema, Oas30PropertySchema, OasDocument, OasNodePath, OasSchema} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";
import {SimplifiedPropertyType} from "../models/simplified-type.model";
import {MarshallUtils} from "../util/marshall.util";
import {SimplifiedTypeUtil} from "../util/model.util";


/**
 * Factory function.
 */
export function createChangePropertyTypeCommand(document: OasDocument,
                                                property: Oas20PropertySchema | Oas30PropertySchema,
                                                newType: SimplifiedPropertyType): ChangePropertyTypeCommand {
    if (document.getSpecVersion() === "2.0") {
        return new ChangePropertyTypeCommand_20(property, newType);
    } else {
        return new ChangePropertyTypeCommand_30(property, newType);
    }
}

/**
 * A command used to modify the type of a property of a schema.
 */
export abstract class ChangePropertyTypeCommand extends AbstractCommand implements ICommand {

    private _propPath: OasNodePath;
    private _propName: string;
    private _newType: SimplifiedPropertyType;

    protected _oldProperty: any;
    protected _oldRequired: boolean;
    protected _nullRequired: boolean;

    /**
     * C'tor.
     * @param {Oas20PropertySchema | Oas30PropertySchema} property
     * @param {SimplifiedPropertyType} newType
     */
    constructor(property: Oas20PropertySchema | Oas30PropertySchema, newType: SimplifiedPropertyType) {
        super();
        if (property) {
            this._propName = property.propertyName();
            this._propPath = this.oasLibrary().createNodePath(property);
        }
        this._newType = newType;
    }

    /**
     * Modifies the type of an operation's property.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangePropertyTypeCommand] Executing: " + this._newType);
        let prop: Oas20PropertySchema | Oas30PropertySchema = this._propPath.resolve(document) as any;
        if (this.isNullOrUndefined(prop)) {
            return;
        }

        let required: string[] = prop.parent()["required"];

        // Save the old info (for later undo operation)
        this._oldProperty = this.oasLibrary().writeNode(prop);
        this._oldRequired = required && required.length > 0 && required.indexOf(prop.propertyName()) != -1;

        // Update the schema's type
        SimplifiedTypeUtil.setSimplifiedType(prop, this._newType);

        if (!this.isNullOrUndefined(this._newType.required)) {
            // Going from optional to required
            if (this._newType.required && !this._oldRequired) {
                if (this.isNullOrUndefined(required)) {
                    required = [];
                    prop.parent()["required"] = required;
                    this._nullRequired = true;
                }
                required.push(prop.propertyName());
            }
            // Going from required to optional
            if (!this._newType.required && this._oldRequired) {
                required.splice(required.indexOf(prop.propertyName()), 1);
            }
        }
    }

    /**
     * Resets the prop type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangePropertyTypeCommand] Reverting.");
        let prop: Oas20PropertySchema | Oas30PropertySchema = this._propPath.resolve(document) as any;
        if (this.isNullOrUndefined(prop)) {
            return;
        }

        let required: string[] = prop.parent()["required"];
        let wasRequired: boolean = required && required.length > 0 && required.indexOf(prop.propertyName()) != -1;

        let parentSchema: OasSchema = prop.parent() as OasSchema;
        let oldProp: OasSchema = parentSchema.createPropertySchema(this._propName);
        this.oasLibrary().readNode(this._oldProperty, oldProp);

        // Restore the schema attributes
        prop.$ref = null;
        prop.type = null;
        prop.enum = null;
        prop.format = null;
        prop.items = null;
        if (oldProp) {
            prop.$ref = oldProp.$ref;
            prop.type = oldProp.type;
            prop.enum = oldProp.enum;
            prop.format = oldProp.format;
            prop.items = oldProp.items;
            if (prop.items) {
                prop.items["_parent"] = prop;
                prop.items["_ownerDocument"] = prop.ownerDocument();
            }
        }

        // Restore the "required" flag
        if (!this.isNullOrUndefined(this._newType.required)) {
            if (this._nullRequired) {
                prop.parent()["required"] = null;
            } else {
                // Restoring optional from required
                if (wasRequired && !this._oldRequired) {
                    required.splice(required.indexOf(prop.propertyName()), 1);
                }
                // Restoring required from optional
                if (!wasRequired && this._oldRequired) {
                    required.push(prop.propertyName());
                }
            }
        }
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._propPath = MarshallUtils.marshallNodePath(obj._propPath);
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._propPath = MarshallUtils.unmarshallNodePath(this._propPath as any);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
    }

}


/**
 * OAI 2.0 impl.
 */
export class ChangePropertyTypeCommand_20 extends ChangePropertyTypeCommand {

    protected type(): string {
        return "ChangePropertyTypeCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class ChangePropertyTypeCommand_30 extends ChangePropertyTypeCommand {

    protected type(): string {
        return "ChangePropertyTypeCommand_30";
    }

}