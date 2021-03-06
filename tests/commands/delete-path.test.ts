///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

/**
 * @license
 * Copyright 2016 JBoss Inc
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

import {commandTest} from "./_test-utils";
import {Oas20Document, Oas30Document} from "oai-ts-core";
import {createDeletePathCommand} from "../../src/commands/delete-path.command";


describe("Delete Path (2.0)", () => {

    it("Delete Path", () => {
        commandTest(
            "tests/_fixtures/commands/delete-path/2.0/delete-path.before.json",
            "tests/_fixtures/commands/delete-path/2.0/delete-path.after.json",
            (document: Oas20Document) => {
                return createDeletePathCommand(document, "/pet/findByStatus");
            }
        );
    });

});


describe("Delete Path (3.0)", () => {

    it("Delete Path", () => {
        commandTest(
            "tests/_fixtures/commands/delete-path/3.0/delete-path.before.json",
            "tests/_fixtures/commands/delete-path/3.0/delete-path.after.json",
            (document: Oas30Document) => {
                return createDeletePathCommand(document, "/foo");
            }
        );
    });

});

