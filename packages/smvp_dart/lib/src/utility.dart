void debugPrint(String text) {
  // ignore: avoid_print
  print(text);
}

void debugPrintException(String text) {
  debugPrint("\x1B[31m$text\x1B[0m");
}

void debugPrintMethod(String methodName) {
  debugPrint("\x1B[36m[Method] $methodName\x1B[0m");
}
