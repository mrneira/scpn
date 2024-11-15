import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoVinculacionRoutingModule } from './tipovinculacion.routing';
import { TipoVinculacionComponent } from './componentes/tipovinculacion.component';

@NgModule({
    imports: [SharedModule, TipoVinculacionRoutingModule],
    declarations: [TipoVinculacionComponent]
})
export class TipoVinculacionModule { }
