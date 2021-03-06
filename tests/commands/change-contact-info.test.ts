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

import {Oas20Document, Oas30Document, OasLibraryUtils} from "oai-ts-core";
import {commandTest} from "./_test-utils";
import {createChangeContactCommand} from "../../src/commands/change-contact-info.command";


describe("Change Contact Info (2.0)", () => {

    let library: OasLibraryUtils = new OasLibraryUtils();

    it("Add Contact", () => {
        commandTest(
            "tests/_fixtures/commands/change-contact-info/2.0/add-contact-info.before.json",
            "tests/_fixtures/commands/change-contact-info/2.0/add-contact-info.after.json",
            (document: Oas20Document) => {
                return createChangeContactCommand(document, "New Contact", "new.contact@example.com", "urn:example.org/newContact");
            }
        );
    });

    it("Update Contact", () => {
        commandTest(
            "tests/_fixtures/commands/change-contact-info/2.0/update-contact-info.before.json",
            "tests/_fixtures/commands/change-contact-info/2.0/update-contact-info.after.json",
            (document: Oas20Document) => {
                return createChangeContactCommand(document, "Updated Contact", "updated.contact@example.com", "urn:example.org/updatedContact");
            }
        );
    });

});


describe("Change Contact Info (3.0)", () => {

    let library: OasLibraryUtils = new OasLibraryUtils();

    it("Add Contact", () => {
        commandTest(
            "tests/_fixtures/commands/change-contact-info/3.0/add-contact-info.before.json",
            "tests/_fixtures/commands/change-contact-info/3.0/add-contact-info.after.json",
            (document: Oas30Document) => {
                return createChangeContactCommand(document, "New Contact", "new.contact@example.com", "urn:example.org/newContact");
            }
        );
    });

    it("Update Contact", () => {
        commandTest(
            "tests/_fixtures/commands/change-contact-info/3.0/update-contact-info.before.json",
            "tests/_fixtures/commands/change-contact-info/3.0/update-contact-info.after.json",
            (document: Oas30Document) => {
                return createChangeContactCommand(document, "Updated Contact", "updated.contact@example.com", "urn:example.org/updatedContact");
            }
        );
    });

});
