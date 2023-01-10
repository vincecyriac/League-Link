import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  strUserName !: string;

  constructor(
    private objAuthService: AuthService,
    private objUserService: UserService,
    private objChRef : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getCurrentUser()
  }

  // Method to logout the current user.
  logout() {
    this.objAuthService.logOut()
  }

  // Method to get the current user's details.
  getCurrentUser() {
    // Send a request to the server to get the current user's details.
    this.objUserService.getCurrentUser().subscribe({
      // On success, set the userName to the first name of the current user.
      next: (objResponse) => {
        this.strUserName = objResponse.name.split(' ')[0],
        this.objChRef.markForCheck()
      }
    });
  }


}
