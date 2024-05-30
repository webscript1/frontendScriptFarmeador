
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculadoraGestionComponent } from './components/calculadora-gestion/calculadora-gestion.component';
import { BotInterfazComponent } from './components/bot-interfaz/bot-interfaz.component';
import { SingInComponent } from './components/sing-in/sing-in.component';
import { SingUpComponent } from './components/sing-up/sing-up.component';

const routes: Routes = [
 // {path:'',component:CalculadoraGestionComponent},
  {path:'',component:SingInComponent},
  {path:'profile',component:BotInterfazComponent},
  {path:'sing-in',component:SingInComponent},
  {path:'sing-up',component:SingUpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


