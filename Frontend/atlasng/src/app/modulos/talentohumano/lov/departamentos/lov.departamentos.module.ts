import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovDepartamentosRoutingModule } from './lov.departamentos.routing';
import { LovDepartamentosComponent } from './componentes/lov.departamentos.component';
import { LovProcesoModule } from '../../lov/proceso/lov.proceso.module';

@NgModule({
  imports: [SharedModule, LovDepartamentosRoutingModule, LovProcesoModule],
  declarations: [LovDepartamentosComponent],
  exports: [LovDepartamentosComponent],
})
export class LovDepartamentosModule { }