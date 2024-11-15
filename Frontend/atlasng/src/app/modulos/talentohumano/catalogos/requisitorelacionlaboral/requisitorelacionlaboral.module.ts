import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RequisitoContratoRoutingModule } from './requisitorelacionlaboral.routing';

import { RequisitoRelacionLaboralComponent } from './componentes/requisitorelacionlaboral.component';
import { LovTipoRelacionLaboralModule } from '../../lov/tiporelacionlaboral/lov.tiporelacionlaboral.module';


@NgModule({
  imports: [SharedModule, RequisitoContratoRoutingModule,LovTipoRelacionLaboralModule ],
  declarations: [RequisitoRelacionLaboralComponent]
})
export class RequisitoRelacionLaboralModule { }
