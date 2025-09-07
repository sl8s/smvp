final class IterationService {
  static final IterationService instance = IterationService._();

  int _number;

  IterationService._() : _number = -1;

  int next() {
    _number++;
    return _number;
  }
}
