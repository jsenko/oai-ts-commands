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
import {Oas20Document, Oas20PropertySchema, Oas30Document, Oas30PropertySchema} from "oai-ts-core";
import {createDeletePropertyCommand} from "../../src/commands/delete-property.command";


describe("Delete Property (2.0)", () => {

    it("Delete Property", () => {
        commandTest(
            "tests/_fixtures/commands/delete-property/2.0/delete-property.before.json",
            "tests/_fixtures/commands/delete-property/2.0/delete-property.after.json",
            (document: Oas20Document) => {
                let schema: Oas20PropertySchema = document.definitions.definition("Order").property("petId") as Oas20PropertySchema;
                return createDeletePropertyCommand(document, schema);
            }
        );
    });

    it("Delete Property (Required)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-property/2.0/delete-property-required.before.json",
            "tests/_fixtures/commands/delete-property/2.0/delete-property-required.after.json",
            (document: Oas20Document) => {
                let schema: Oas20PropertySchema = document.definitions.definition("Order").property("petId") as Oas20PropertySchema;
                return createDeletePropertyCommand(document, schema);
            }
        );
    });

});


describe("Delete Property (3.0)", () => {

    it("Delete Property", () => {
        commandTest(
            "tests/_fixtures/commands/delete-property/3.0/delete-property.before.json",
            "tests/_fixtures/commands/delete-property/3.0/delete-property.after.json",
            (document: Oas30Document) => {
                let schema: Oas30PropertySchema = document.components.getSchemaDefinition("MySchema1").property("address") as Oas30PropertySchema;
                return createDeletePropertyCommand(document, schema);
            }
        );
    });

    it("Delete Property (Required)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-property/3.0/delete-property-required.before.json",
            "tests/_fixtures/commands/delete-property/3.0/delete-property-required.after.json",
            (document: Oas30Document) => {
                let schema: Oas30PropertySchema = document.components.getSchemaDefinition("MySchema1").property("address") as Oas30PropertySchema;
                return createDeletePropertyCommand(document, schema);
            }
        );
    });

});

