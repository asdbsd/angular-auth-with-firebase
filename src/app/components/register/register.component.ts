import { Component, OnInit } from '@angular/core';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  faGoogle = faGooglePlusG;
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
