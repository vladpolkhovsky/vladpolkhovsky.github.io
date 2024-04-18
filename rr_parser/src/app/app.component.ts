import {Component, Input} from '@angular/core';

export interface MetaColumn {
  name: string,
  type: string
}

export interface Table {
  linesKeys: MetaColumn[],
  values: string[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'rr_parser';

  @Input()
  textAreaText: string = '';

  tablesContent: {
    key: string,
    metaCols: MetaColumn[],
    values: string[]
  }[] = [];

  processTextArea() {
    var json = JSON.parse(this.textAreaText)
    console.log(json)
    for(let key in json) {
      if (key.toLowerCase() == "transportguid") {
        continue;
      }
      var index = this.tablesContent.push({
        metaCols: [],
        values: [],
        key: key,
      });
      var escapedJson = JSON.parse(json[key]);
      //var unescapedJson = JSON.parse(escapedJson);
      console.log(escapedJson)
      escapedJson.meta.forEach((metaEntry: MetaColumn) => {
        this.tablesContent.at(index - 1)?.metaCols.push(metaEntry);
      })
      escapedJson.rows.forEach((value: string) => {
        this.tablesContent.at(index - 1)?.values.push(value);
      })
    }
    console.log(this.tablesContent)
  }
}
