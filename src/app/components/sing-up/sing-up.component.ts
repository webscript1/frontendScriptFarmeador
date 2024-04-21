import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { user } from 'src/app/interfaces/interfaces-gestion';
import { UserService } from 'src/app/services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.scss']
})
export class SingUpComponent implements OnInit {
  public user:user
  public list_Subscription:Array<Subscription>=[]
  public message:string
  public loading:boolean
  miFormulario!: FormGroup;
  constructor(
    private _userservice:UserService,
    private fb: FormBuilder,
    private _router:Router,
    private toastr: ToastrService,
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
      passwordRoot:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],

      // ... otros campos
    });
  }
    // Obtén controles del formulario para facilitar el acceso en la plantilla
    get emailControl() { return this.miFormulario.get('email'); }
    get passwordControl() { return this.miFormulario.get('password'); }
    get passwordRootControl() { return this.miFormulario.get('passwordRoot'); }
  
  ngOnDestroy(): void {
    this.list_Subscription.forEach((item)=>{
       item.unsubscribe
    })
  }

  sing_up(){
    this.loading=true
    let subcription1=this._userservice.sing_up(this.user).subscribe(
      response=>{
        console.log(response)
        this.loading=false
        this.toastr.success(`${response.message}`,'',);
        this._router.navigate(['/sing-in'])
      },error=>{
        console.log(error)
        if(error.status===401 || error.status===500 || error.status===409){
          this.message=error.error.message
        }
        this.loading=false
      }
    )
    this.list_Subscription.push(subcription1)
  }
  onSubmit(){
    if (this.miFormulario.valid) {
      const formulario=this.miFormulario.value
      // Realiza acciones con los datos del formulario
      this.user.email=formulario.email
      this.user.password=formulario.password
      this.user.passwordRoot=formulario.passwordRoot
      
      console.log();
      this.sing_up()
    }else{
      console.log('formulario invalido')
      console.log(this.miFormulario.value)
    }
  }


}
