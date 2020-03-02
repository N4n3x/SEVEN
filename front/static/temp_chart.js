class Graph_temp {
    constructor(url) {
        this.url = url;
        this.get_data().then((rep) => {
            console.log(rep);
            this.data = this.format_data(rep);
            // this.chart = this.disp_chars(this.data);
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
        const response = await fetch(this.url, myInit);
        const myJson = await response.json();
        console.log(myJson);
        return myJson
    }

    format_data(e) {
        console/log(e);
        // var labels = e.id_station.map(function (val) {
        //     return val.date;
        // });
        // var data_time = e.timestamp.map(function (val) {
        //     return val.eur;
        // });
        // var data_temp = e.temperature.map(function (val) {
        //     return val.usd;
        // });

        // return [labels, data_time, data_temp]
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
}