import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DepartamentoRoutingModule } from './departamento.routing';
import { DepartamentoComponent } from './componentes/departamento.component';
import { LovProcesoModule } from '../../lov/proceso/lov.proceso.module';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
    imports: [SharedModule, DepartamentoRoutingModule, LovProcesoModule, LovFuncionariosModule],
    declarations: [DepartamentoComponent]
})
export class DepartamentoModule { }
