import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatTooltipModule
} from "@angular/material";
import {SidenavFilterComponent} from "./component/sidenav/sidenav-filter.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FiltersComponent} from "./component/filters.component";
import {FilterComponent} from "./component/filter.component";
import {FilterGroupsComponent} from "./component/filter-groups.component";
import {FilterBooleanComponent} from "./component/filter-types/filter-boolean.component";
import {FilterIntervalComponent} from "./component/filter-types/filter-interval.component";
import {FilterMultiselectComponent} from "./component/filter-types/filter-multiselect.component";
import {FilterStringComponent} from "./component/filter-types/filter-string.component";
import {TagInputModule} from "ngx-chips";
import {CommonModule} from "../common/common.module";

@NgModule({
  declarations: [
    SidenavFilterComponent,
    FilterGroupsComponent,
    FiltersComponent,
    FilterComponent,
    FilterBooleanComponent,
    FilterIntervalComponent,
    FilterMultiselectComponent,
    FilterStringComponent
  ],
  exports: [
    SidenavFilterComponent
  ],
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    TagInputModule,
    CommonModule
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: []
})
export class FilterModule {
}
