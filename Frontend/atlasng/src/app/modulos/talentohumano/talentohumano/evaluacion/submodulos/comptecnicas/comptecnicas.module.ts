import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ComptecnicasRoutingModule } from './comptecnicas.routing';

import { ComptecnicasComponent } from './componentes/comptecnicas.component';
import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import { LovIdiomasModule } from '../../../../../generales/lov/idiomas/lov.idiomas.module';

import { OverlayPanelModule } from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, ComptecnicasRoutingModule,LovPaisesModule,LovIdiomasModule,OverlayPanelModule],
  declarations: [ComptecnicasComponent],
  exports: [ComptecnicasComponent]
})
export class ComptecnicasModule { }
