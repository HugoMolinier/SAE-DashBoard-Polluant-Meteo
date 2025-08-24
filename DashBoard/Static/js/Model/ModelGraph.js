/**
 * Class representing a graph model for graphics generation and management.
 */
class ModelGraph {
  /**
   * Constructor of the ModelGraph class. Initialize all
   */
  static instancesGraph = [];
  constructor() {
    this.chart = null;
    this.chartData = [];
    ModelGraph.instancesGraph.push(this);
  }

  /**
   * Defines graph data.
   * @param {Array} data - Data to be defined.
   */
  setData(data) {
    this.chartData = data;
  }

  /**
   * Gets current graph data.
   * @returns {Array} Current chart data.
   */
  getdata() {
    return this.chartData;
  }

  /**
   * Hides a graphic element. A pollutant or other
   * @param {string} nom_element - The name of the element to be hidden.
   */
  cacherElement(nom_element) {
    this.chart.hide(nom_element);
    this.chart.legend.hide(nom_element);
  }

  /**
   * Displays a graph element.
   * @param {string} nom_element - The name of the element to be displayed.
   */
  afficherElement(nom_element) {
    this.chart.show(nom_element);
    this.chart.legend.show(nom_element);
  }

  /**
   * Updates graphic resizing.
   */
  majResize() {
    this.chart.resize();
  }

  /**
   * Generates a "gauge" graph.
   * @param {string} name_id - The ID of the HTML element to be linked to the graphic.
   */
  generateGraphEssuieGlace(name_id) {
    this.chart = bb.generate({
      data: {
        columns: this.chartData,
        type: "gauge", // for ESM specify as: gauge()
        colors: this.appliquerColor(),
      },
      padding: {
        left: 0,
      },
      gauge: {
        type: "multi",
        max: 100,
        min: 0,
        arcs: {
          minWidth: 30, // réduire pour moins de chevauchement
        },
        fullCircle: false, // permet de laisser de l’espace pour les labels
        startingAngle: -90, // centrer le premier arc
      },
      legend: {
        item: {
          tile: {
            type: "scare",
            r: 5,
          },
        },
      },
      bindto: "#" + name_id,
    });
  }

  /**
   * Generates a bar chart.
   * @param {boolean} [afficher_point=false] - Indicates whether points should be displayed on the graph.
   */
  generateGraphEnBaton(afficher_point = false) {
    this.chart = bb.generate({
      boost: {
        useCssRule: true,
      },
      data: {
        x: "x",
        columns: this.chartData,
        types: {
          data1: "area-line-range", // for ESM specify as: areaLineRange()
        },
        colors: this.appliquerColor(),
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            fit: true,
            format: "%Y-%m-%d %H:%M:%S",
          },
        },
      },
      bindto: "#contener_courbes",
      zoom: {
        enabled: true,
      },
      point: {
        show: afficher_point,
      },
    });
  }

  /**
   * Applies colors of pollutants to the graph.
   * @returns {Object} The colors of the pollutants.
   */
  appliquerColor() {
    return {
      NO: "#1879f4",
      NO2: "#78c8ff",
      O3: "#5af3aa",
      "NOX as NO2": "#00aaa0",
      PM10: "#ff4876",
      "PM2.5": "#ffa96a",
      SO2: "#ffed8f",
      C6H6: "#c818f4",
      CO: "#18f4ea",
    };
  }

  /**
   * Adds data instead of reloading everything, generation must be in reverse order
   * @param {*} data
   */
  ajouterData(data) {
    if (this.getdata().length == 0) {
      this.chartData = data;
      this.generateGraphEnBaton();
    } else {
      this.chart.load({
        columns: data,
        append: true,
        resizeAfter: true,
      });
    }
  }

  /**
   * Destroys the graph.
   */
  detruireGraph() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
