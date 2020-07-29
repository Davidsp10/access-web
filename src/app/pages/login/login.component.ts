import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';

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
    // if(this.authService.isAuthenticated()){
    //   console.log("Hola, ya estás autenticado!");
    //   this._router.navigate(['/home']);
    // }
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
        this._router.navigate(['/home']);  
        console.log(`Hola ${user.username}, iniciaste sesión con éxito!`);
      },
      error => {
        if(error.status == 400) {
          console.log("Usuario o clave incorrecta!");
        }
      });
  }

}