import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PrestamosRoutingModule } from './prestamos.routing';
import { PrestamosComponent } from './componentes/prestamos.component';


@NgModule({
  imports: [SharedModule, PrestamosRoutingModule],
  declarations: [PrestamosComponent],
  exports: [PrestamosComponent]
}) 
export class PrestamosModule { }  