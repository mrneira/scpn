import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AccionesDePersonalRoutingModule } from './accionesdepersonal.routing';
import { AccionesDePersonalComponent } from './componentes/accionesdepersonal.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { EditorModule } from 'primeng/primeng';
import { LovDesignacionesModule } from '../../lov/designaciones/lov.designaciones.module';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';
@NgModule({
  imports: [SharedModule, AccionesDePersonalRoutingModule, LovFuncionariosModule, GestorDocumentalModule,JasperModule,EditorModule,LovDesignacionesModule],
  declarations: [AccionesDePersonalComponent]
})
export class AccionesDePersonalModule { }
