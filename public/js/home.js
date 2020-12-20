$(document).ready(function() {
    var socket = io({
        transportOptions: {
          polling: {
            extraHeaders: {
              'x-client-id': 'simulator'
            }
          }
        }
      });

    const createVehicle = function(e) {
        socket.emit('create_vehicle');
    }

    $('.create-vehicle').off('click', createVehicle);
    $('.create-vehicle').on('click', createVehicle);

    lines = [];
    generateLines();

    socket.on('drive_update', function(data) {
        console.log('drive_update');
        if(data.hasOwnProperty('lines')) {
            lines = data.lines;
           
        }
        generateLines();
    });
    

    function generateLines() {
        $('.lines').empty();
        if(lines.length) {
            lines.forEach(function(line) {
                if(line.hasOwnProperty('key')) {
                    let $lineList = $('ul.' + line.key);
                    if($lineList.length && line.hasOwnProperty('vehicles') && line.vehicles.length) {
                        line.vehicles.forEach(function(vehicle) {
                            let bg = vehicle.on_sensor ? '' : 'bg-danger';
                            $lineList.append(`<li class="list-group-item ${bg}">
                                                <div class="d-flex w-100 justify-content-between">
                                                    <h5 class="mb-1">Vehicle: ${vehicle.vehicle_id}</h5>
                                                    <div>
                                                        <button class="btn btn-info" title="Move vehicle"><i class="fa fa-car"></i> A</button>
                                                        <button class="btn btn-warning" title="Move vehicle"><i class="fa fa-car"></i> B</button>
                                                    </div>
                                                </div>
                                            </li>`);
                        });
                    }
                }
            })
        }
    }

});