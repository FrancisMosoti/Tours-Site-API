const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

// middleware
app.use(express.json());

const tours = fs.readFileSync(
  `${__dirname}/dev-data/data/tours-simple.json`,
  'utf-8',
);
const toursData = JSON.parse(tours);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

const postTour = (req, res) => {
  //   console.log(req.body);

  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  toursData.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),

    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > toursData.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > toursData.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getSingleTour = (req, res) => {
  console.log(req.params);

  const id = parseInt(req.params.id);

  const tour = toursData.find((el) => el.id === id);

  //   if (id > toursData.length - 1) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID',
  //     });
  //   }

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

// app.get('/api/v1/tours', getAllTours);

// app.post('/api/v1/tours', postTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// app.get('/api/v1/tours/:id', getSingleTour);

app.route('/api/v1/tours').get(getAllTours).post(postTour);
app
  .route('/api/v1/tours/:id')
  .patch(updateTour)
  .delete(deleteTour)
  .get(getSingleTour);

app.listen(port, () => {
  console.log(`Server is running on port ${port}... `);
});
module.exports = app;
