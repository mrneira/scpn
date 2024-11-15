import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PlantillaVinculacionRoutingModule } from './plantillavinculacion.routing';
import { PlantillaVinculacionComponent } from './componentes/plantillavinculacion.component';
import { LovTipoVinculacionModule } from '../../lov/tipovinculacion/lov.tipovinculacion.module';

@NgModule({
    imports: [SharedModule, PlantillaVinculacionRoutingModule, LovTipoVinculacionModule],
    declarations: [PlantillaVinculacionComponent]
})
export class PlantillaVinculacionModule { }
