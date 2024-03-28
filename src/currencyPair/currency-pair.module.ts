import { Module } from "@nestjs/common";
import { currencyPairService } from "./currency-pair.service";
import { superAdminController } from "./superAdmin.controller";

@Module({
    controllers:[superAdminController],
    providers:[currencyPairService]
})

export class currencyPairModule{}