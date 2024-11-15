import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CertificadoCarteraRoutingModule } from './certificadoCartera.routing';

import { CertificadoCarteraComponent } from './componentes/certificadoCartera.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, CertificadoCarteraRoutingModule, JasperModule,LovPersonasModule],
  declarations: [CertificadoCarteraComponent]
})
export class CertificadoCarteraModule { }
