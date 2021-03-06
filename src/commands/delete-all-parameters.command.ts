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

import {AbstractCommand, ICommand} from "../base";
import {
    IOasParameterParent,
    Oas20Operation,
    Oas20PathItem,
    Oas30Operation,
    Oas30PathItem,
    OasDocument,
    OasNodePath,
    OasParameterBase
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";


/**
 * Factory function.
 */
export function createDeleteAllParametersCommand(document: OasDocument,
                                                 parent: Oas20Operation | Oas20PathItem | Oas30Operation | Oas30PathItem,
                                                 type: string): DeleteAllParametersCommand {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteAllParametersCommand_20(parent, type);
    } else {
        return new DeleteAllParametersCommand_30(parent, type);
    }
}

/**
 * A command used to delete all parameters from an operation.
 */
export abstract class DeleteAllParametersCommand extends AbstractCommand implements ICommand {

    private _parentPath: OasNodePath;
    private _paramType: string;

    private _oldParams: any[];


    /**
     * C'tor.
     * @param {Oas20Operation | Oas20PathItem} parent
     * @param {string} type
     */
    constructor(parent: Oas20Operation | Oas20PathItem | Oas30Operation | Oas30PathItem, type: string) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
        this._paramType = type;
    }

    /**
     * Deletes the parameters.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllParameters] Executing.");
        this._oldParams = [];

        let parent: IOasParameterParent = (<any>this._parentPath.resolve(document)) as IOasParameterParent;
        if (this.isNullOrUndefined(parent) || this.isNullOrUndefined(parent.parameters) || parent.parameters.length === 0) {
            return;
        }

        // Save the params we're about to delete for later undd
        let paramsToRemove: OasParameterBase[] = [];
        for (let param of parent.parameters) {
            if (param.in === this._paramType) {
                this._oldParams.push(this.oasLibrary().writeNode(param));
                paramsToRemove.push(param);
            }
        }

        if (this._oldParams.length === 0) {
            return;
        }

        paramsToRemove.forEach( paramToRemove => {
            parent.parameters.splice( parent.parameters.indexOf(paramToRemove), 1);
        });
    }

    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllParameters] Reverting.");

        if (this._oldParams.length === 0) {
            return;
        }

        let parent: IOasParameterParent = (<any>this._parentPath.resolve(document)) as IOasParameterParent;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        this._oldParams.forEach( param => {
            let p: OasParameterBase = parent.createParameter();
            this.oasLibrary().readNode(param, p);
            parent.addParameter(p);
        });
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath as any);
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteAllParametersCommand_20 extends DeleteAllParametersCommand {

    protected type(): string {
        return "DeleteAllParametersCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteAllParametersCommand_30 extends DeleteAllParametersCommand {

    protected type(): string {
        return "DeleteAllParametersCommand_20";
    }

}