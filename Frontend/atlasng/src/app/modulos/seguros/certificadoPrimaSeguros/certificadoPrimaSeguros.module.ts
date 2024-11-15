import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CertificadoPrimaSegurosRoutingModule } from './certificadoPrimaSeguros.routing';
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { CertificadoPrimaSegurosComponent } from './componentes/certificadoPrimaSeguros.component';
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, CertificadoPrimaSegurosRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [CertificadoPrimaSegurosComponent]
})
export class CertificadoPrimaSegurosModule { }
