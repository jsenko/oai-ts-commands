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
import {Oas20Operation, Oas30Operation, OasDocument, OasNodePath, OasOperation, OasResponse, Oas20Response, Oas30Response} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createNewResponseCommand(document: OasDocument, operation: Oas20Operation | Oas30Operation,
        statusCode: string, sourceResponse?: OasResponse): NewResponseCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewResponseCommand_20(operation, statusCode, sourceResponse);
    } else {
        return new NewResponseCommand_30(operation, statusCode, sourceResponse);
    }
}

/**
 * A command used to create a new response in an operation.
 */
export abstract class NewResponseCommand extends AbstractCommand implements ICommand {

    private _operationPath: OasNodePath;
    private _statusCode: string;

    private _created: boolean;
    private _nullResponses: boolean;

    private sourceResponse: any;

    /**
     * C'tor.
     * @param {Oas20Operation | Oas30Operation} operation
     * @param {string} statusCode
     */
    constructor(operation: Oas20Operation | Oas30Operation, statusCode: string, sourceResponse?: OasResponse) {
        super();
        if (operation) {
            this._operationPath = this.oasLibrary().createNodePath(operation);
        }
        this._statusCode = statusCode;
        if (sourceResponse) {
            this.sourceResponse = this.oasLibrary().writeNode(sourceResponse);
        }
    }

    /**
     * Creates a response for the operation.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewResponseCommand] Executing.  Status Code=%s", this._statusCode);

        this._created = false;
        this._nullResponses = false;

        let operation: OasOperation = this._operationPath.resolve(document) as OasOperation;
        if (this.isNullOrUndefined(operation)) {
            return;
        }

        if (this.isNullOrUndefined(operation.responses)) {
            operation.responses = operation.createResponses();
            this._nullResponses = true;
        }

        let response: OasResponse = operation.responses.response(this._statusCode) as OasResponse;
        if (this.isNullOrUndefined(response)) {
            response = operation.responses.createResponse(this._statusCode) as OasResponse;
            if (this.sourceResponse) {
                response = this.oasLibrary().readNode(this.sourceResponse, response) as OasResponse;
            }
            operation.responses.addResponse(this._statusCode, response);
            this._created = true;
        }
    }

    /**
     * Removes the previously created body param.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewResponseCommand] Reverting.");

        let operation: OasOperation = this._operationPath.resolve(document) as OasOperation;
        if (this.isNullOrUndefined(operation)) {
            return;
        }

        if (this._nullResponses) {
            operation.responses = null;
            return;
        }

        if (!this._created) {
            return;
        }

        operation.responses.removeResponse(this._statusCode);
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._operationPath = MarshallUtils.marshallNodePath(obj._operationPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._operationPath = MarshallUtils.unmarshallNodePath(this._operationPath as any);
    }

}


/**
 * OAI 2.0 impl.
 */
export class NewResponseCommand_20 extends NewResponseCommand {

    protected type(): string {
        return "NewResponseCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class NewResponseCommand_30 extends NewResponseCommand {

    protected type(): string {
        return "NewResponseCommand_30";
    }

}