import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { PlantillasNotificacionRoutingModule } from './plantillasNotificacion.routing';
import { PlantillasNotificacionComponent } from './componentes/plantillasNotificacion.component';
import {EditorModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, PlantillasNotificacionRoutingModule, EditorModule ],
  declarations: [PlantillasNotificacionComponent]
})
export class PlantillasNotificacionModule { }
