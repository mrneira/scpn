import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CertificadoSocioRoutingModule } from './certificadoSocio.routing';

import { CertificadoSocioComponent } from './componentes/certificadoSocio.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovSociosCertificadosModule } from './submodulo/socioscertificados/lov.socioscertificados.module';

@NgModule({
  imports: [SharedModule, CertificadoSocioRoutingModule, JasperModule,LovSociosCertificadosModule],
  declarations: [CertificadoSocioComponent]
})
export class CertificadoSocioModule { }
