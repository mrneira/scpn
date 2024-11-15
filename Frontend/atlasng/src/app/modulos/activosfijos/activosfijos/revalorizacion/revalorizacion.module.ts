import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RevalorizacionRoutingModule } from './revalorizacion.routing';
import { LovCodificadosModule } from '../../lov/codificados/lov.codificados.module';

import { RevalorizacionComponent } from './componentes/revalorizacion.component';


@NgModule({
  imports: [SharedModule, RevalorizacionRoutingModule,LovCodificadosModule ],
  declarations: [RevalorizacionComponent]
})
export class RevalorizacionModule { }
