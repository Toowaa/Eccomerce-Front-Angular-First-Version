  import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';
  
  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
   /*private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;*/

    private currentUserSubject = new BehaviorSubject<any>(null);
    currentUser = this.currentUserSubject.asObservable();

    constructor() {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
      this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
      return this.currentUserSubject.value;
    }

  
    getUserId(): number | null {
      const user = this.currentUserSubject.value;
      return user ? user.dni : null;
    }
  
    getUsername(): string | null {
      const user = this.currentUserSubject.value;
      return user ? user.usuario : null;
    }

    getdireccion():string |null{
      const user = this.currentUserSubject.value;
      return user ? user.direccion : null;
    }
    
    login(user: any) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }

    logout() {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
      return this.currentUserValue !== null;
    }

    

    
  
    
  }