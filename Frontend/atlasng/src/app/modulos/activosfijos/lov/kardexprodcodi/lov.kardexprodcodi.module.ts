import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovKardexProdCodiRoutingModule } from './lov.kardexprodcodi.routing';

import { LovKardexProdCodiComponent } from './componentes/lov.kardexprodcodi.component';


@NgModule({
  imports: [SharedModule, LovKardexProdCodiRoutingModule],
  declarations: [LovKardexProdCodiComponent],
  exports: [LovKardexProdCodiComponent]
})
export class LovKardexProdCodiModule { }

