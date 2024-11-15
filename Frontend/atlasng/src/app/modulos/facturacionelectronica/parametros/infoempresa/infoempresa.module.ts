import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InfoEmpresaRoutingModule } from './infoempresa.routing';

import { InfoEmpresaComponent } from './componentes/infoempresa.component';


@NgModule({
  imports: [SharedModule, InfoEmpresaRoutingModule ],
  declarations: [InfoEmpresaComponent]
})
export class InfoEmpresaModule { }
