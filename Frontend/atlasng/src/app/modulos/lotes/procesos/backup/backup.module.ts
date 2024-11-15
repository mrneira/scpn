import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BackupRoutingModule } from './backup.routing';
import { BackupComponent } from './componentes/backup.component';


@NgModule({
  imports: [SharedModule, BackupRoutingModule ],
  declarations: [BackupComponent]
})
export class BackupModule { }
