import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private  authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const url: string = state.url;
    return this.authService.checkAuthentication().map(user => {
      this.authService.setUser(user);
      console.log(user);
      if (url === '/login') {
        return !user;
      } else {
        if (user) {
          return true;
        }
        this.authService.redirectUrl = url;
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
