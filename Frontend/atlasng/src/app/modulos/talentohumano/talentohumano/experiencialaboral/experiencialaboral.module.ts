import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ExperienciaLaboralRoutingModule } from './experiencialaboral.routing';

import { ExperienciaLaboralComponent } from './componentes/experiencialaboral.component';

import { EmpresaComponent } from './componentes/_empresa.component';

import { ReferenciaComponent } from './componentes/_referencia.component';

import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';



@NgModule({
  imports: [SharedModule, ExperienciaLaboralRoutingModule,LovFuncionariosModule],
  declarations: [ExperienciaLaboralComponent,EmpresaComponent,ReferenciaComponent]
})
export class ExperienciaLaboralModule { }
