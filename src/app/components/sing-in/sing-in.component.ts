import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { user } from 'src/app/interfaces/interfaces-gestion';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-sing-in',
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.scss']
})
export class SingInComponent implements OnDestroy, OnInit {
  miFormulario!: FormGroup;

  public loading:boolean
  public user:user
  public list_Subscription:Array<Subscription>=[]
  public message:string
  constructor(
    private _userservice:UserService,
    private _Router:Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ){
   this.user={
    email:'',
    password:'',
    passwordRoot:'',
    role:''
   }
   this.message=''
   this.loading=false
  }
  ngOnInit() {
    this.miFormulario = this.fb.group({
      // Define los campos y las validaciones aquí
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // ... otros campos
    });
  }
  // Obtén controles del formulario para facilitar el acceso en la plantilla
  get emailControl() { return this.miFormulario.get('email'); }
  get passwordControl() { return this.miFormulario.get('password'); }

  ngOnDestroy(): void {
    this.list_Subscription.forEach((item)=>{
       item.unsubscribe
    })
  }

  singIn(){
    this.message=''
    this.loading=true
   const subscription= this._userservice.sing_in(this.user).subscribe(
      response=>{
        console.log(response)
        localStorage.setItem('token',response.token)
        this.toastr.success(`${response.message}`,'',);
       // setTimeout(()=>{
               this._Router.navigate(['/profile'])
       // },3000)
       this.loading=false
    
      },
      error=>{
        console.log(error)
        if(error.status===401 || error.status===404){
          this.message=error.error.message
        }
        this.loading=false
      }
    )
    this.list_Subscription.push(subscription)
  }
  onSubmit(){
    if (this.miFormulario.valid) {
      const formulario=this.miFormulario.value
      // Realiza acciones con los datos del formulario
      this.user.email=formulario.email
      this.user.password=formulario.password
      
      console.log();
      this.singIn()
    }else{
      console.log('formulario invalido')
      console.log(this.miFormulario.value)
    }

  }

}
