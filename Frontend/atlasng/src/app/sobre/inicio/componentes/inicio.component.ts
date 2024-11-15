import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-inicio',
  template: ``
})
export class InicioComponent implements OnInit {

  constructor(public router: Router) {
  }


  ngOnInit() {
    if (sessionStorage.getItem('path') !== undefined && sessionStorage.getItem('path') !== null) {
      this.router.navigate([sessionStorage.getItem('path')], { skipLocationChange: true });
    }
  }
}
