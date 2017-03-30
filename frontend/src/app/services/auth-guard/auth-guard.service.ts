import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private  authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    /*console.log(this.authService.isLoggedIn());*/
    if (url === '/login') {

      return !this.authService.isLoggedIn();
    } else {
      if (this.authService.isLoggedIn()) {
        return true;
      }
      this.authService.redirectUrl = url;
      this.router.navigate(['/login']);
      return false;
    }
  }
}
