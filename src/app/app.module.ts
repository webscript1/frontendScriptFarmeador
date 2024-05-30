
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { NgClass } from '@angular/common'; // Importar NgClass


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivatedSymbolsComponent } from './components/activated-symbols/activated-symbols.component';
import { BotInterfazComponent } from './components/bot-interfaz/bot-interfaz.component';
import { CalculadoraGestionComponent } from './components/calculadora-gestion/calculadora-gestion.component';
import { InfoPositionComponent } from './components/info-position/info-position.component';
import { MenuComponent } from './components/menu/menu.component';
import { OpenPositionComponent } from './components/open-position/open-position.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { SingInComponent } from './components/sing-in/sing-in.component';
import { SingUpComponent } from './components/sing-up/sing-up.component';
import { SettingComponent } from './components/setting/setting.component';
import { InstanciasAutoComponent } from './components/instancias-auto/instancias-auto.component';
import { CreateInstanciaComponent } from './components/create-instancia/create-instancia.component';
import { RsiDetailComponent } from './components/rsi-detail/rsi-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    ActivatedSymbolsComponent,
    BotInterfazComponent,
    CalculadoraGestionComponent,
    InfoPositionComponent,
    MenuComponent,
    OpenPositionComponent,
    SingInComponent,
    SingUpComponent,
    SettingComponent,
    InstanciasAutoComponent,
    CreateInstanciaComponent,
    RsiDetailComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgClass,
    NgxPaginationModule
    
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
