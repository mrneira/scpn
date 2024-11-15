import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DocumentosVinculantesRoutingModule } from './documentosvinculantes.routing';
import { DocumentosVinculantesComponent } from './componentes/documentosvinculantes.component';
import { EditorModule } from 'primeng/primeng';

import { LovDesignacionesModule } from '../../lov/designaciones/lov.designaciones.module';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

import { JasperModule } from '.././../../../util/componentes/jasper/jasper.module';
@NgModule({
    imports: [SharedModule, DocumentosVinculantesRoutingModule, EditorModule,JasperModule, LovDesignacionesModule, LovFuncionariosModule],
    declarations: [DocumentosVinculantesComponent]
})
export class DocumentosVinculantesModule { }
