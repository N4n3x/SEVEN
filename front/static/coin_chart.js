class Graph_coin {
    constructor() {
        this.get_data().then((rep) => {
            this.data = this.format_data(rep);
            this.chart = this.disp_chars(this.data);
        });
    }

    async get_data() {
        var myHeaders = new Headers();

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            "mimeType": "multipart/form-data"
        };
        const response = await fetch('http://127.0.0.1:5001/api/v1/price/bitcoin', myInit);
        const myJson = await response.json();
        console.log(myJson.Coin);
        return myJson
    }

    format_data(e) {
        var labels = e.Coin.map(function (val) {
            return val.date;
        });
        var data_eur = e.Coin.map(function (val) {
            return val.eur;
        });
        var data_usd = e.Coin.map(function (val) {
            return val.usd;
        });

        return [labels, data_eur, data_usd]
    }

    disp_chars(data) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data[0],
                datasets: [{
                    label: "EUR",
                    data: data[1],
                    borderColor: 'rgb(250,130,20)',
                    borderWidth: 1
                }, {
                    label: "USD",
                    data: data[2],
                    borderColor: 'rgb(40,130,200)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });
        return myChart
    }

    reste_chart() {
        let charts_class = this;
        this.get_data().then((data_updated)=>{
            let data_prepare = charts_class.format_data(data_updated);
            charts_class.chart.data.datasets.forEach((dataset) => {
                switch(dataset.label){
                    case "EUR":
                        dataset.data = data_prepare[1];
                        break;
                    case "USD":
                        dataset.data = data_prepare[2];
                        break;
                }
                
            });
            charts_class.chart.update();
        })
        
    }
}