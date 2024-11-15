import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InstitucionEducativaRoutingModule } from './institucioneducativa.routing';

import { InstitucionEducativaComponent } from './componentes/institucioneducativa.component';


@NgModule({
  imports: [SharedModule, InstitucionEducativaRoutingModule ],
  declarations: [InstitucionEducativaComponent]
})
export class InstitucionEducativaModule { }
