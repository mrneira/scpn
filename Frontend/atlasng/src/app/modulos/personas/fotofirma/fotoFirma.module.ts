import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { FotoFirmaRoutingModule } from './fotoFirma.routing';
import { FotoFirmaComponent } from './componentes/fotoFirma.component';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import {FileUploadModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, FotoFirmaRoutingModule, LovPersonasModule, FileUploadModule ],
  declarations: [FotoFirmaComponent]
})
export class FotoFirmaModule { }
