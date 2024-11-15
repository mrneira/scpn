import { NgModule } from '@angular/core';
import { SharedModule } from './../../../util/shared/shared.module';
import { HorariosAtencionRoutingModule } from './horariosAtencion.routing';

import { HorariosAtencionComponent } from './componentes/horariosAtencion.component';
import { ConfirmDialogModule } from 'primeng/primeng';

@NgModule({
  imports: [
      SharedModule,
      HorariosAtencionRoutingModule,
      ConfirmDialogModule
    ],
  declarations: [
      HorariosAtencionComponent
    ]
})
export class HorariosAtencionModule { }