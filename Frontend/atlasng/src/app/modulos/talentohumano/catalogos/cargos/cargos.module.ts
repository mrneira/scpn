import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargosRoutingModule } from './cargos.routing';
import { CargosComponent } from './componentes/cargos.component';
import { LovDepartamentosModule } from '../../lov/departamentos/lov.departamentos.module';

import { EditorModule } from 'primeng/primeng';


@NgModule({
	imports: [SharedModule, CargosRoutingModule, LovDepartamentosModule, EditorModule],
	declarations: [CargosComponent]
})
export class CargosModule { }
