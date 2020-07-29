import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})

export class LoginComponent implements OnInit {

  inputs = null;
  user: User;
  
  constructor(private authService: AuthService, private _router: Router) {
    this.user = new User();
  }

  ngOnInit() {
    this.inputs = document.querySelectorAll(".input");
    this.inputs.forEach(input => {
      input.addEventListener("focus", this.addcl);
      input.addEventListener("blur", this.remcl);
    });

    //CHECK_SESSION STEP 2
    if(this.authService.isAuthenticated()){
      console.log("Hola, ya estás autenticado!");
      swal('Advertencia!', 'Ya estás autenticado', 'warning');
      this._router.navigate(['/home']);
    }
  }

  addcl(e) {
    let parent = e.target.parentNode.parentNode;
    parent.classList.add("focus");
  }

  remcl(e) {
    let parent = e.target.parentNode.parentNode;
    if(e.value == ""){
      parent.classList.remove("focus");
    }
  }

  login(): void {
    console.log(this.user);
    if(this.user.username == null || this.user.password == null){
      console.log("Faltan datos");
      swal('¡Advertencia!', 'Faltan datos por completar', 'warning');
      return;
    }

    this.authService.login(this.user).subscribe(
      response => {
        console.log(response); 
        //let payload = JSON.parse(atob(response.access_token.split(".")[1]));
        //console.log(payload.user_name);
        this.authService.saveUser(response.access_token);
        this.authService.saveToken(response.access_token);
        let user = this.authService.user;
        console.log(`Hola ${user.username}, iniciaste sesión con éxito!`);
        swal('Login', `Hola ${user.username}, iniciaste sesión con éxito!`, 'success');
        this._router.navigate(['/home']);  
        
      },
      error => {
        if(error.status == 400) {
          console.log("Usuario o clave incorrecta!");
          swal('¡Error!', 'Usuario o clave incorrecta(s)', 'error');
        }
      });
  }

}