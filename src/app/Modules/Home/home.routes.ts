import { Routes } from "@angular/router";
import { Component } from '@angular/core';
import { CusMainhomeComponent } from "./cus-mainhome/cus-mainhome.component";
import { CusCurtransComponent } from './cus-curtrans/cus-curtrans.component';
import { HistoryComponent } from "../cus-trans/history/history.component";
import { CusPaymentComponent } from "./cus-payment/cus-payment.component";

export const homeRoute: Routes = [
    {path: 'homemain',component: CusMainhomeComponent,
        children: [
            {path:"cuscurtrans",component:CusCurtransComponent},
            {path:"history/:tid",component:HistoryComponent,
                children: [
                    {path:"payment",component:CusPaymentComponent},
                    {path:"",redirectTo:"payment",pathMatch:"full"}
                ]
            },
            {path:"",redirectTo:"cuscurtrans",pathMatch:"full"}
    ]

    },
    {path:"",redirectTo:'homemain',pathMatch:'full'}

]