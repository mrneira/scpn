import { NgModule } from '@angular/core';
import { SharedModule } from './../../../../../../util/shared/shared.module';
import { LovSociosCertificadosRoutingModule } from './lov.socioscertificados.routing';
import { LovSociosCertificadosComponent } from './componentes/lov.socioscertificados.component';

@NgModule({
  imports: [SharedModule, LovSociosCertificadosRoutingModule],
  declarations: [LovSociosCertificadosComponent],
  exports: [LovSociosCertificadosComponent],
})
export class LovSociosCertificadosModule { }

