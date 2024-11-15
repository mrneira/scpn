import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { GrupoOcupacionalRoutingModule } from './grupoocupacional.routing';
import { GrupoOcupacionalComponent } from './componentes/grupoocupacional.component';

@NgModule({
    imports: [SharedModule, GrupoOcupacionalRoutingModule],
    declarations: [GrupoOcupacionalComponent]
})
export class GrupoOcupacionalModule { }
