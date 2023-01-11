import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {

  private objDestroyed$ = new Subject();

  strUserName !: string;

  constructor(
    private objAuthService: AuthService,
    private objUserService: UserService,
    private objChRef : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getCurrentUser()
  }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  // Method to logout the current user.
  logout() {
    this.objAuthService.logOut()
  }

  // Method to get the current user's details.
  getCurrentUser() {
    // Send a request to the server to get the current user's details.
    this.objUserService.getCurrentUser().pipe(takeUntil(this.objDestroyed$)).subscribe({
      // On success, set the userName to the first name of the current user.
      next: (objResponse) => {
        this.strUserName = objResponse.name.split(' ')[0],
        this.objChRef.markForCheck()
      }
    });
  }


}
