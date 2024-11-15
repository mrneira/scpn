import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ProcesoRoutingModule } from './proceso.routing';
import { ProcesoComponent } from './componentes/proceso.component';

@NgModule({
    imports: [SharedModule, ProcesoRoutingModule],
    declarations: [ProcesoComponent]
})
export class ProcesoModule { }
